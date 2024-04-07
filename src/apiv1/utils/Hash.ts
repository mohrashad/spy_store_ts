import bcrypt from 'bcrypt';

export const hash = async (str: string ): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash( str, salt )
}

export const compare = async (str: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare( str, hash )
}

